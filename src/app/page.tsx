import HomeStory from '@/sections/HomeStory/HomeStory';
import Contact from '@/sections/Contact/Contact';
import Experience from '@/sections/Experience/Experience';
import Works from '@/sections/Works/Works';

export default function HomePage() {
  return (
    <>
      <HomeStory />
      <Works />
      <Experience />
      <Contact />
    </>
  );
}
