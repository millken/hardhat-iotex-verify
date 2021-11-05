import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";

import { pluginName } from "./constants";
import { Store, VerifyApiResponse } from "./types";

export async function submitSourcesToIotexScout(
  apiUrl: string,
  address: string,
  store: Store
): Promise<VerifyApiResponse> {
  const form = new FormData();
  form.append("compilerVersion", store.longVersion);
  form.append("inputJSON", store.inputJSON);
  form.append("contractAddress", address);
  let response: AxiosResponse;
  try {
    response = await axios.post(apiUrl, form, { headers: form.getHeaders() });
  } catch (error) {
    const err = error as Error;
    throw new NomicLabsHardhatPluginError(pluginName, err.message);
  }
  const resp = new VerifyApiResponse(response.data);
  return resp;
}
