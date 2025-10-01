// file: Typewriter.js

import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Typewriter.module.css';

const Typewriter = ({ actions }) => {
    // #########################################################################################
    // Variable declarations
    const [text, setText] = useState('');
    const [cursorPos, setCursorPos] = useState(0);
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [renderedText, setRenderedText] = useState(<></>);


    // Define textIndexRef here
    const textIndexRef = useRef(0);

    // #########################################################################################
    // Sequence of actions from the array of actions
    const executeCurrentAction = () => {
        if (currentIndex >= actions.length) {
            setCompleted(true);
            return;
        }

        const action = actions[currentIndex];

        // Reset selection before 'type' and 'delete' actions
        if (action.type !== 'select') {
            setSelection({ start: 0, end: 0 });
        }

        switch (action.type) {
            case 'type':
                handleTyping(action.text);
                break;
            case 'delete':
                handleDeleting(action.chars);
                break;
            case 'erase':
                handleErasing(action.chars);
                break;
            case 'select':
                handleSelection(action.chars);
                break;
            case 'move':
                handleMove(action.direction, action.chars);
                break;
            case 'delay':
                handleDelay(action.ms);
                break;
            default:
                break;
        }
    };

    // #########################################################################################
    // Typing action
    const handleTyping = async (textToType) => {
        const initialCursorPos = cursorPos; // Get the current cursor position

        for (let i = 0; i < textToType.length; i++) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    setText((prevText) => {
                        // Insert the character at the current cursor position
                        const newText = prevText.slice(0, initialCursorPos + i) + textToType.charAt(i) + prevText.slice(initialCursorPos + i);

                        // Instead of calling rendering functions here, we'll just update the text
                        return newText;
                    });

                    // Update the cursor position for each typed character
                    setCursorPos(initialCursorPos + i + 1);

                    resolve();
                }, 100);
            });
        }

        // Move to the next action after typing is complete
        setCurrentIndex(currentIndex + 1);
    };

    // useEffect to handle rendering when text or cursorPos changes
    useEffect(() => {
        const characters = splitTextIntoCharacters(text);
        const renderedContent = renderTextAndCursor(characters, cursorPos);
        setRenderedText(renderedContent);
    }, [text, cursorPos]); // Dependencies


    const splitTextIntoCharacters = (text) => {
        return text.split('');
    };

    const renderTextAndCursor = (characters, cursorPosition) => {


        return characters.map((char, index) => (
            console.log(`Rendering character: ${char}, at index: ${index}, cursor at: ${cursorPosition}`),
            <React.Fragment key={index}>
                {char}
                {index === cursorPosition && <span className={styles.cursor}></span>}
            </React.Fragment>
        ));
    };

    // #########################################################################################
    // Deleting action (delete one character at a time to the left of the cursor)
    const handleDeleting = (chars) => {
        let deleteCount = 0;
        let localCursorPos = cursorPos; // Local variable to track cursor position

        const intervalId = setInterval(() => {
            if (localCursorPos > 0) {
                setText((prevText) => {
                    const newText = prevText.substring(0, localCursorPos - 1) + prevText.substring(localCursorPos);
                    // console.log("### Deleting Step ###");
                    // console.log("### localCursorPos (before):", localCursorPos);
                    // console.log("### prevText:", prevText);
                    // console.log("### newText:", newText);
                    return newText;
                });

                localCursorPos--; // Decrement localCursorPos here
            }

            deleteCount++;
            // console.log("### deleteCount:", deleteCount);

            if (deleteCount >= chars) {
                clearInterval(intervalId);
                setCursorPos(localCursorPos); // Update cursor position state
                setTimeout(() => setCurrentIndex(currentIndex + 1), 0);
            }
        }, 100); // Adjust the speed of deletion as necessary
    };

    // #########################################################################################
    // Erasing action (delete all selected characters
    const handleErasing = (chars) => {
        setText((prevText) => {
            const start = Math.max(cursorPos - chars, 0);
            const newText = prevText.substring(0, start) + prevText.substring(cursorPos);
            // Reset the selection state after erasing
            setSelection({ start: 0, end: 0 });
            return newText;
        });

        setCursorPos((prevPos) => {
            const newPos = Math.max(prevPos - chars, 0);
            // We use a setTimeout here to ensure that the state update is processed
            // before moving to the next action.
            setTimeout(() => setCurrentIndex(currentIndex + 1), 0);
            return newPos;
        });
    };

    // #########################################################################################
    // Selection action (select a range of characters)
    const handleSelection = (chars) => {
        const start = Math.max(cursorPos - chars, 0);
        const end = cursorPos;

        setSelection({ start, end });
        console.log('handleSelection start:', start);
        console.log('handleSelection end:', end);

        // Move to the next action after selection is made
        setCurrentIndex(currentIndex + 1);
    };

    const renderSelection = (characters, selectionRange) => {
        return characters.map((char, index) => (
            <span key={index} className={index >= selectionRange.start && index < selectionRange.end ? styles.selected : ''}>
                {char}
            </span>
        ));
    };

    // useEffect for handling rendering when selection changes
    useEffect(() => {
        const characters = splitTextIntoCharacters(text);
        const renderedContent = renderSelection(characters, selection);
        setRenderedText(renderedContent);
    }, [selection, text]); // Dependencies: re-run when selection or text changes


    // #########################################################################################
    // Delay action (wait for a specified number of milliseconds)
    const handleDelay = (ms) => {
        setTimeout(() => setCurrentIndex(currentIndex + 1), ms);
    };

    const splitTextBySelection = (text, selection) => {
        const beforeSelection = text.substring(0, selection.start);
        const selectedText = text.substring(selection.start, selection.end);
        const afterSelection = text.substring(selection.end);
        return { beforeSelection, selectedText, afterSelection };
    };

    // #########################################################################################
    // Move action (move the cursor left or right a specified number of characters)
    const handleMove = (direction, chars) => {
        let moveCount = 0;
        const intervalId = setInterval(() => {
            setCursorPos((prevPos) => {
                if (direction === 'left') {
                    return Math.max(prevPos - 1, 0);
                } else {
                    return Math.min(prevPos + 1, text.length);
                }
            });

            moveCount++;
            if (moveCount >= chars) {
                clearInterval(intervalId);
                // Schedule the update of currentIndex to ensure it happens after state updates
                setTimeout(() => setCurrentIndex(currentIndex + 1), 0);
            }
        }, 100); // Adjust the speed of cursor movement as necessary
    };

    // #########################################################################################
    // useEffect to handle rendering when text or cursorPos changes
    useEffect(() => {
        if (!completed) {
            executeCurrentAction();
        }
    }, [currentIndex, completed]);

    // #########################################################################################
    // #########################################################################################
    // #########################################################################################
    // Debugging function to log state changes and the action that triggered them
    const logStateChange = (stateName, value, actionType) => {
        console.log(`State Change Detected: ${stateName} changed to '${value}' by action '${actionType}'`);
    };
    // #########################################################################################
    // useEffect to handle logging when state changes
    useEffect(() => {
        if (currentIndex < actions.length) {
            const actionType = actions[currentIndex].type;
            logStateChange('currentIndex', currentIndex, actionType);
        }
    }, [currentIndex, actions]);
    // #########################################################################################
    // useEffect to handle logging when state changes
    useEffect(() => {
        logStateChange('text', text, actions[currentIndex]?.type || 'Unknown');
    }, [text, actions, currentIndex]);
    // #########################################################################################
    // useEffect to handle logging when state changes
    useEffect(() => {
        logStateChange('cursorPos', cursorPos, actions[currentIndex]?.type || 'Unknown');
    }, [cursorPos, actions, currentIndex]);


    return (
        <div>
            <h2>{renderedText}</h2>
        </div>
    );
};

export default Typewriter;


