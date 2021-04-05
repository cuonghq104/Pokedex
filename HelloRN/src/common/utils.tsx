import _ from "lodash";

/**
 * transform server_text to "Server text"
 * @param serverText
 */
export const formatNameFromServer = (serverText: any) => {
  return _.capitalize(_.replace(serverText, new RegExp("-", "g"), " "));
}

export const exactIdFromUrl = (url) => {
  const urlSplit = url.split('/');
  return urlSplit[urlSplit.length - 2];
}