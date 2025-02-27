const Accordion = ({ children, isCommentOpen }) => {
    return (
        <div className={`overflow-hidden transition-all duration-300 ${isCommentOpen ? "max-h-96" : "max-h-0"}`}>
            {children}
        </div>
    )
}

export default Accordion