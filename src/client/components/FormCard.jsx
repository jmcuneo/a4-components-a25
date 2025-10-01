import "./Theme.css";

function FormCard({children}) {
    return (
        <div className="rounded-xl bg-card-main-color p-5">
            {children}
        </div>
    )
}
export default FormCard;