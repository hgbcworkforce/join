
import { footerLinks, socialLinks, mediaLinks, contactLinks } from "../data";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-zinc-950 text-gray-400 pb-10 overflow-hidden">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 md:mt-24 border-t border-zinc-900 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-3 sm:space-y-4">
              {footerLinks.map((item, index) => (
                <li key={index}>
                  <a href={item.path} target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors text-sm font-medium">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-4 sm:mb-6">Connect</h3>
            <ul className="space-y-3 sm:space-y-4">
              {contactLinks.map((item, index) => (
                <li key={index}>
                  <a href={item.path} target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors text-sm font-medium">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Media */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-4 sm:mb-6">Media</h3>
            <ul className="space-y-3 sm:space-y-4">
              {mediaLinks.map((item, index) => (
                <li key={index}>
                  <a href={item.path} target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors text-sm font-medium">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-4 sm:mb-6">Contact Us</h3>
            <p className="text-sm mb-4 leading-relaxed">
              Higher Ground Baptist Church, <br />Adekehin Close, Behind Alata Milk & Honey, Under G, Ogbomoso, Oyo State, Nigeria.
            </p>
            <a href="mailto:contacthgbc@gmail.com" className="text-orange-500 text-sm font-bold block mb-2 hover:underline">
              contacthgbc@gmail.com
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[11px] tracking-widest">
            © {new Date().getFullYear()} Higher Ground Baptist Church. All Rights Reserved.
          </p>
          <div className="flex gap-3 sm:gap-4">
            {socialLinks.map((item, index) => (
              <a
                key={index}
                href={item.path}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-600 transition-all"
                aria-label="Social Link"
              >
                <item.icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
