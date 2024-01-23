import type { MetaFunction } from "@remix-run/node";
import { ClientLoaderFunctionArgs, json, useNavigate } from "@remix-run/react";
import { cache, useCachedLoaderData } from "~/hook/useCachedLoaderData";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/2");
  const user = await response.json();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return json({ user });
};

export const clientLoader = async ({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const existingData = cache.get(request.url);
  const data = existingData ? existingData : await serverLoader();
  cache.set(request.url, data);
  const deferedData = serverLoader();
  console.log("prodje?", data);
  return { data, deferedData, test: "a", key: request.url };
};
clientLoader.hydrate = true;

export default function Index() {
  const { user } = useCachedLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div>
      {user.name} <hr /> {user.email}
      <hr />
      {user.username}
      <hr />
      {user.website}
      <button onClick={() => navigate("/test")}>Test</button>
    </div>
  );
}
