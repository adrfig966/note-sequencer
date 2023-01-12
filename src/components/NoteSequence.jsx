import {useState, useEffect} from 'react';

const NoteSequence = ({notepattern, row, setnote}) => {
    const [noteSequence, setNoteSequence] = useState([]);

    useEffect(() => {
        setNoteSequence(notepattern);
    }, [notepattern]);
    
    return (
        <div className="note-sequence">
            {noteSequence.map((note, index) => (
                <div
                    key={index}
                    className={`note ${note ? 'active' : ''}`}
                    onClick={() => setnote(row, index)}
                >
                    {note ? note : '+'}
                </div>

            ))}
        </div>
    )

}

export default NoteSequence;