import { Route, Switch, Link } from 'wouter';
import { KoalaProvider } from './context/KoalaContext';
import Home from './pages/Home';
import Details from './pages/Details';
import KinshipCalculator from './pages/Kinship';
import { Calculator, Home as HomeIcon } from 'lucide-react';

const NotFound = () => <div className="p-4 text-center mt-10">404 Not Found</div>;

function App() {
  return (
    <KoalaProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 font-sans pb-safe">
        <header className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/">
              <h1 className="font-bold text-xl tracking-tight text-green-700 dark:text-green-500 cursor-pointer flex items-center gap-2">
                🐨 KoalaDB
              </h1>
            </Link>
            <nav className="flex gap-4">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-green-600">
                <HomeIcon className="w-6 h-6" />
              </Link>
              <Link href="/calculator" className="text-gray-600 dark:text-gray-300 hover:text-green-600">
                <Calculator className="w-6 h-6" />
              </Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/koala/:id" component={Details} />
            <Route path="/calculator" component={KinshipCalculator} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </KoalaProvider>
  );
}

export default App;
