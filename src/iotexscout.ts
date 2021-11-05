import axios from "axios";
import FormData from "form-data";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";

import { pluginName } from "./constants";
import { Store } from "./types";

export async function submitSourcesToIotexScout(
  apiUrl: string,
  address: string,
  store: Store
): Promise<void> {
  const form = new FormData();
  form.append("compilerVersion", store.longVersion);
  form.append("inputJSON", store.inputJSON);
  form.append("contractAddress", address);
  await axios
    .post(apiUrl, form, { headers: form.getHeaders() })
    .then((res) => {
      const data = res.data;
      console.log(data.error);
    })
    .catch((err) => {
      const error = err as Error;
      throw new NomicLabsHardhatPluginError(pluginName, error.message);
    });
}
