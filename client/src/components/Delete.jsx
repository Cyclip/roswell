import { MdDelete } from "react-icons/md";
import "../styles/CommentOption.css"

const Delete = ({ handleDelete }) => {
    return (
        <div className="comment_option"
            onClick={handleDelete}
        >
            <MdDelete className="comment_option-icon" />
            Delete
        </div>
    );
}

export default Delete;