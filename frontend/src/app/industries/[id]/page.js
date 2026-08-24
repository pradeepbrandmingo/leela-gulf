import IndustryDetailClient from "./IndustryDetailClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  // Format readable title from slug
  const title = id
    ? id
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Industry Detail";

  return {
    title: `${title} | Leela Gulf FZC`,
    description: `Explore Leela Gulf's specialty chemical solutions for the ${title} industry. Transparent global sourcing, technical documentation, and bulk supply worldwide.`,
  };
}

export default async function IndustryDetailPage({ params }) {
  const { id } = await params;

  return <IndustryDetailClient industryId={id} />;
}
