const MainSection = ({ children }: { children?: React.ReactNode }) => {
    return (
        <section className="lg:w-[calc(100%_-_16rem)] px-4 py-2 lg:ml-auto">
            {children}
        </section>
    );
}

export default MainSection;