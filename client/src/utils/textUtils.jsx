// parse text (linebreaks)
export const parseText = (text) => {
    return text.split("\n").map((item, key) => {
        return <span key={key}>{item}<br /></span>
    })
}