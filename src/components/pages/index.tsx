// pages/index.js
import Navbar from '../Navbar';

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="p-4">
        <h2 className="text-2xl font-bold text-center">Welcome to MyApp!</h2>
        <p className="text-center mt-4">Your journey starts here.</p>
      </main>
    </div>
  );
}

export default Home;
