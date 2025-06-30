"use client"
import { SingleLearningResourcesUI } from "@/components/Dashboard/resources/SingleResourcePage";
import { useParams } from "next/navigation";

export default function SingleResourcesPage() {
    const params = useParams();
    const resourceId = params.id as string;
 return (
    <div>
      <SingleLearningResourcesUI id={resourceId}/>
    </div>
  );
}