const Footer = () => {
    return (
        <footer className="bg-[#1F1F39] text-on-surface-secondary py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <img src="/logo.png" alt="EduSpark Logo" className="w-10 h-10 bg-white p-[2px] rounded-md" />
                        <span className="text-2xl font-bold text-white">Edu<span className="text-primary">Spark</span></span>
                    </div>
                    <p className="text-sm">A new way to make students engaged in learning through a fun and interactive platform.</p>
                </div>
                <div>
                    <h3 className="font-bold text-white mb-4">Our Services</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-primary">Online Exams</a></li>
                        <li><a href="#" className="hover:text-primary">Performance Tracking</a></li>
                        <li><a href="#" className="hover:text-primary">Payment Management</a></li>
                        <li><a href="#" className="hover:text-primary">Learning Resources</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="font-bold text-white mb-4">Contact Us</h3>
                    <p className="text-sm mb-4">Contact to our Team for the latest updates.</p>
                    <div className="flex">
                        <input type="email" placeholder="youremail@gmail.com" className="w-full rounded-l-md border-0 py-2.5 px-3 text-sm bg-[#3B3B53] text-white placeholder-gray-400" />
                        <button className="bg-secondary text-white font-semibold px-4 rounded-r-md">Go</button>
                    </div>
                </div>
            </div>
            <div className="text-center text-sm mt-16 border-t border-gray-700 pt-8">
                <p>&copy; 2025 EduSpark. All Rights Reserved.</p>
            </div>
        </footer>
    );
};
export default Footer;