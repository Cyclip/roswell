import { BsFillFlagFill } from "react-icons/bs";
import "../styles/CommentOption.css"

const Report = ({ handleReport }) => {
    return (
        <div className="comment_option report"
            onClick={handleReport}
        >
            <BsFillFlagFill className="comment_option-icon" />
            Report
        </div>
    );
}

export default Report;