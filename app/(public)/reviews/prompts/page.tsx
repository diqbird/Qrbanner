import { redirect } from 'next/navigation';

/** Public review prompt templates removed — redirect to honest reviews page. */
export default function ReviewPromptsPage() {
  redirect('/reviews');
}
