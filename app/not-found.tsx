import Navbar from '@/components/homepage/sections/navbar';
import Footer from '@/components/homepage/sections/footer';
export default function notFound() {
    return (
        <>
            <Navbar variant='landing' />
            <div className="h-screen flex items-center justify-center text-2xl font-bold text-white">404 | Page Not Found</div>
            <Footer />
        </>
    );
}
