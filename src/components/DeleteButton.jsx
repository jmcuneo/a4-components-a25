const DeleteButton = (props) => {
    const handleDelete = async () => {
        const patientId = props.data.id; // Assuming your data has an '_id' field
        try {
            const response = await fetch(`/api/patient/${patientId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete patient');
            }
            // Refresh data by calling the callback from App component
            props.onDelete();
        } catch (error) {
            console.error("Deletion failed:", error);
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="h-full w-full flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
        >
            Delete
        </button>
    );
};

export default DeleteButton