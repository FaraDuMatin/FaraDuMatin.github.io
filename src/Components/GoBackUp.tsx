import "./GoBackUp.css";  




const GoBackUp = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button className="go-back-up" onClick={scrollToTop}>
            ↑
        </button>
    );
};

export default GoBackUp;
