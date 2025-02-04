const ReturnModal = ({ value, handleReturnRequest, closeModal, handleOnChangeReturnMsg, returnOrderId, returnOrder }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Submit Return Request</h3>
                <textarea
                    value={value}
                    onChange={(e) => handleOnChangeReturnMsg(e.target.value)}
                    placeholder="Please provide a reason for return..."
                    className="w-full h-32 border rounded-md p-2 mb-4 resize-none"
                />
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={closeModal} // Use the prop directly
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"

                        onClick={returnOrderId ? returnOrder : handleReturnRequest}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReturnModal