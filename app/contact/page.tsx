import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt | BookNest',
  description: 'Kontaktujte tým BookNest. Jsme tu pro vás!',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Kontakt</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📧 Email
            </h2>
            <p className="text-gray-600 mb-2">
              Pro obecné dotazy a podporu:
            </p>
            <a
              href="mailto:info@booknest.cz"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              info@booknest.cz
            </a>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🐛 Technická podpora
            </h2>
            <p className="text-gray-600 mb-2">
              Nahlášení chyb a technické problémy:
            </p>
            <a
              href="mailto:support@booknest.cz"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              support@booknest.cz
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Kontaktní formulář
          </h2>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="label">
                Jméno *
              </label>
              <input
                id="name"
                type="text"
                className="input"
                placeholder="Vaše jméno"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email *
              </label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="vas@email.cz"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="label">
                Předmět
              </label>
              <select id="subject" className="input">
                <option value="">Vyberte předmět...</option>
                <option value="general">Obecný dotaz</option>
                <option value="bug">Nahlášení chyby</option>
                <option value="feature">Návrh na novou funkci</option>
                <option value="feedback">Zpětná vazba</option>
                <option value="other">Jiné</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="label">
                Zpráva *
              </label>
              <textarea
                id="message"
                rows={6}
                className="input"
                placeholder="Napište nám vaši zprávu..."
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              onClick={(e) => {
                e.preventDefault()
                alert('Děkujeme za vaši zprávu! Tato funkce je v demo verzi deaktivována.')
              }}
            >
              Odeslat zprávu
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            * Povinná pole
          </p>
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            💡 Tip
          </h3>
          <p className="text-gray-700">
            Než nás kontaktujete, zkuste se podívat do{' '}
            <a href="/about" className="text-primary-600 hover:text-primary-700 font-medium">
              sekce O nás
            </a>
            {' '}nebo do našich{' '}
            <a href="/discussions" className="text-primary-600 hover:text-primary-700 font-medium">
              diskuzí
            </a>
            , kde můžete najít odpovědi na časté otázky od ostatních uživatelů.
          </p>
        </div>
      </div>
    </div>
  )
}
