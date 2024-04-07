import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';

const IconButton = (props) => {
    const { icon, onClick, styling = "", text = "" } = props;
    const [style, setStyle] = useState("");

    useEffect(() => {
        const newStylíng = "" + styling;
        setStyle(newStylíng);
    }, [styling]);

    return (
        <Button onClick={onClick} className={style} >
            {text && <span className="fw-bold"> {text} </span>}
            {icon &&
                <span className="">
                    <FontAwesomeIcon icon={icon} />
                </span>
            }
        </Button>
    );
}

export default IconButton;