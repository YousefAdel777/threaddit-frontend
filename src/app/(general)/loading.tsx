import Loading from "@/features/common/components/Loading"

const LoadingPage = () => {
    return (
        <div className="flex items-center justify-center">
            <Loading text="Loading..." />
        </div>
    );
}

export default LoadingPage;