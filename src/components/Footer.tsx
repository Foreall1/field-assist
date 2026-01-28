import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-field-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-field-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-semibold text-xl">
                FIELD <span className="text-field-light">Assist</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Het kennisplatform voor professionals in het fysieke domein.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Kennisbank</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/kennisbank/vergunningen" className="hover:text-field-light transition-colors">
                  Vergunningverlening
                </Link>
              </li>
              <li>
                <Link href="/kennisbank/handhaving" className="hover:text-field-light transition-colors">
                  Toezicht & Handhaving
                </Link>
              </li>
              <li>
                <Link href="/kennisbank/juridisch" className="hover:text-field-light transition-colors">
                  Juridisch
                </Link>
              </li>
              <li>
                <Link href="/kennisbank/ruimtelijke-ordening" className="hover:text-field-light transition-colors">
                  Ruimtelijke Ordening
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Ondersteuning</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/help" className="hover:text-field-light transition-colors">
                  Helpcentrum
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-field-light transition-colors">
                  Veelgestelde vragen
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-field-light transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-field-light transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-field-light" />
                <span>info@fieldassist.nl</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-field-light" />
                <span>088 - 123 4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-field-light mt-0.5" />
                <span>Postbus 1234<br />1000 AB Amsterdam</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            2024 FIELD Assist. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-field-light transition-colors">
              Privacy
            </Link>
            <Link href="/voorwaarden" className="hover:text-field-light transition-colors">
              Voorwaarden
            </Link>
            <Link href="/toegankelijkheid" className="hover:text-field-light transition-colors">
              Toegankelijkheid
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
