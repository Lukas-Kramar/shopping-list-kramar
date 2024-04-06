import { useState } from "react";
import Button from 'react-bootstrap/Button';

const LanguageSwitcher = () => {
    const [languages, setLanguages] = useState(["ENG", "CZ"]);
    const [selectedLanguage, setSelectedLanguage] = useState("ENG");

    const changeLanguage = (lang) => {
        console.log("changing lang to: ", lang);
    }

    return (
        <div className="mb-3">
            {languages.map((lang) => {
                return lang === selectedLanguage ? (
                    <Button
                        variant="secondary"
                        disabled
                        className="mx-1 fw-bold"
                    >
                        {lang}
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        className="mx-1 fw-bold"
                        disabled
                        onClick={() => changeLanguage(lang)}
                    >
                        {lang}
                    </Button>
                );
            })}
        </div>
    );
}

export default LanguageSwitcher;