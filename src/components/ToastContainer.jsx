export default function ToastContainer({ children }) {
    return (
        <div className="
                            fixed
                            top-4
                            right-4
                            z-50
                            flex
                            flex-col
                            gap-3
        ">
            {children}
        </div>
    );
}