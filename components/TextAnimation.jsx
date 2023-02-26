import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TextAnimation = ({ sentences }) => {
    const textRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ repeat: -1 });

        sentences.forEach((sentence, sentenceIndex) => {
            const words = sentence.split(" ");

            tl.to(textRef.current, { duration: 0, text: "" }, sentenceIndex * 2);

            words.forEach((word, index) => {
                tl.to(
                    textRef.current,
                    { duration: 0.5, text: `${word} ` },
                    sentenceIndex * 2 + index * 0.5 + 0.5
                );
            });
        });
    }, [sentences]);

    return <div ref={textRef}></div>;
};

export default TextAnimation;
