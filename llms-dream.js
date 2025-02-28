import { useFireproof } from "use-fireproof";
import { useState, useEffect } from 'react';

function App({ listID, currentUserId }) {
  // Define database instances
  const noteLedger = fireproof('noteLedger');
  const peopleDB = fireproof('peopleDB');
  const listDB = fireproof('listDB');
  const voteLedger = fireproof('voteLedger');

  // note is like a note, it goes on a list, and has an author
  // lots of authors can have notes on the same list
  // so far each note only has one author, on the authorId field
  // later we'll explore how to migrate to multiple authors per note

  noteLedger.put({
    list_id: listID,
    author_id: 'author-1',
    text: 'hello world',
    created_at: new Date()
  })

  peopleDB.put({
    _id: 'author-1',
    name: 'Author 1',
    points: 50
  })

  listDB.put({
    _id: listID,
    name: `List ${listID}`
  })

  const { rows } = noteLedger.
    select('*').
    where(({ list_id }) => list_id === listID).
    join(peopleDB).
    on(({ authorId }, { _id }) => authorId === _id).
    orderBy(({ created_at }, { points }) => [points, new Date(created_at)]).
    desc().
    limit(100)

  const notesWithAuthorForListId = rows.map(({ noteLedger, peopleDB }) => {
    return {
      ...noteLedger,
      author: peopleDB
    }
  })

  const [newNote, setNewNote] = useState({text: ''});
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      const { rows: [ user ] } = await peopleDB.select('*').where(({ _id }) => _id === currentUserId);
      setCurrentUser(user);
    };
    fetchUser();
  }, [currentUserId]);

  const getCurrentUserPoints = async () => {
    const { rows: [ { points } ] } = await peopleDB.select('points').where(({ _id }) => _id === currentUserId);
    return points || 0;
  };

  // Function to handle upvote
  const handleUpvote = async (noteId) => {
    const currentPoints = await getCurrentUserPoints();
    
    await voteLedger.put({
      note_id: noteId,
      user_id: currentUserId,
      points: currentPoints,
      created_at: new Date().toISOString()
    });
  };

  return (
    <div>
      <h2>Notes for List {listID}</h2>
      <div className="note-input">
        <input 
          value={newNote.text || ''}
          onChange={e => setNewNote({...newNote, text: e.target.value})}
          placeholder="Add a new note..."
        />
        <button onClick={async () => {
          if (!currentUser) return;
          
          await noteLedger.put({
            list_id: listID,
            author_id: currentUser._id,
            text: newNote.text,
            created_at: new Date().toISOString()
          });
          
          await peopleDB.put({
            ...currentUser,
            points: (currentUser.points || 0) + 5
          });
          
          setNewNote({text: ''});
        }}>Add Note</button>
      </div>
      
      <div className="notes-list">
        {notesWithAuthorForListId.map(note => (
          <div key={note._id} className="note-card">
            <div className="note-header">
              <span className="author-name">{note.author.name}</span>
              <span className="note-date">{new Date(note.created_at).toLocaleDateString()}</span>
            </div>
            <div className="note-content">{note.text}</div>
            <div className="note-actions">
              <button onClick={() => noteLedger.put({
                ...note,
                text: prompt('Edit note:', note.text) || note.text
              })}>Edit</button>
              <button onClick={() => noteLedger.delete(note._id)}>Delete</button>
              <button 
                onClick={() => handleUpvote(note._id)}
                className="upvote-button"
              >
                Upvote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
