import { Route, Switch, Link } from 'wouter';
import { KoalaProvider } from './context/KoalaContext';
import Home from './pages/Home';
import Details from './pages/Details';
import KinshipCalculator from './pages/Kinship';
import FamilyTree from './pages/FamilyTree';
import { Calculator, Home as HomeIcon } from 'lucide-react';

const NotFound = () => <div className="p-4 text-center mt-10">404 Not Found</div>;

function App() {
  return (
    <KoalaProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 font-sans pb-safe">
        <header className="bg-koala-green text-white p-4 shadow-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/">
              <h1 className="text-xl font-bold flex items-center gap-2 cursor-pointer">
                <span>🐨</span> コアラ家系図サーチ
              </h1>
            </Link>
            <nav className="flex gap-4">
              <Link href="/" className="hover:text-green-100 transition-colors">
                <HomeIcon className="w-6 h-6" />
              </Link>
              <Link href="/calculator" className="hover:text-green-100 transition-colors">
                <Calculator className="w-6 h-6" />
              </Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/koala/:id" component={Details} />
            <Route path="/tree/:id" component={FamilyTree} />
            <Route path="/calculator" component={KinshipCalculator} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </KoalaProvider>
  );
}

export default App;
