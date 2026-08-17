import Parse from "parse";

if (!Parse.applicationId) {
  Parse.initialize(
    process.env.NEXT_PUBLIC_PARSE_APP_ID ?? "",
    process.env.NEXT_PUBLIC_PARSE_JS_KEY ?? ""
  );
  Parse.serverURL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL ?? "";
}

export default Parse;

export interface ItemAttributes {
  name: string;
  completed: boolean;
  owner?: Parse.User;
}

export type ItemObject = Parse.Object<ItemAttributes>;
