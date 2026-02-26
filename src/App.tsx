import { Route, Switch } from 'wouter';
import { KoalaProvider } from './context/KoalaContext';
import Home from './pages/Home';
import Details from './pages/Details';
import KinshipCalculator from './pages/Kinship';
import FamilyTree from './pages/FamilyTree';

const NotFound = () => <div className="p-4 text-center mt-10">404 Not Found</div>;

function App() {
  return (
    <KoalaProvider>
      <div className="min-h-screen bg-koala-light text-koala-text font-sans selection:bg-koala-base/30">
        <div className="max-w-md mx-auto bg-koala-light min-h-screen relative shadow-sm">
          <main>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/koala/:id" component={Details} />
              <Route path="/tree/:id" component={FamilyTree} />
              <Route path="/calculator" component={KinshipCalculator} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </KoalaProvider>
  );
}

export default App;
