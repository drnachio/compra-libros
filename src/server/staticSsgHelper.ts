import {
  createInnerTRPCContext,
} from "./api/trpc";
import { appRouter } from "./api/root";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";

const staticSsgHelper = () => {
  const context = createInnerTRPCContext({ session: null });
  const result = createProxySSGHelpers({
    router: appRouter,
    ctx: context,
    transformer: superjson,
  });
  return result;
};

export default staticSsgHelper;