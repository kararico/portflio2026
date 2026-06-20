import type { Metadata } from 'next';
import HomeStory from '@/sections/HomeStory/HomeStory';
import Contact from '@/sections/Contact/Contact';
import Experience from '@/sections/Experience/Experience';
import Works from '@/sections/Works/Works';
import { buildHomeMetadata } from '@/utils/seo';

export const metadata: Metadata = buildHomeMetadata();

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
