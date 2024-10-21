import * as SecureStore from "expo-secure-store";
export async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}
export async function getValueFor(key: string) {
  try {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
  }
}
export async function deleteKey(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    console.log(e);
  }
}
export function updateToken(newToken: string) {
  deleteKey("token");
  save("token", newToken);
}
