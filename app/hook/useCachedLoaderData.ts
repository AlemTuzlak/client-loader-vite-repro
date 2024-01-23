import { SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

export let cache = new Map();

export const useCachedLoaderData = <T extends any>() => {
  const { data, deferedData, key } = useLoaderData<any>();
  console.log("data", data);
  const [freshData, setFreshData] = useState<any>(
    cache.get(key)
      ? cache.get(key)
      : {
          ...data,
        }
  );
  console.log("freshData", data);
  useEffect(() => {
    if (!deferedData) return;
    deferedData.then((newData: any) => {
      if (JSON.stringify(newData) !== JSON.stringify(freshData)) {
        cache.set(key, newData);
        setFreshData(newData);
      }
    });
  }, [deferedData]);

  return { ...freshData } as SerializeFrom<T>;
};
