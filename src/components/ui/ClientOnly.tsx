"use client";

import { useEffect, useState } from "react";

/**
 * ClientOnly: A utility component that prevents hydration mismatches by ensuring
 * its children only render after the initial client-side mount.
 * 
 * This is an extreme defensive measure against browser extensions (translators, 
 * security suites) that manipulate the DOM before React finishes hydration.
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
