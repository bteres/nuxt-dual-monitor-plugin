export default defineNuxtPlugin((nuxtApp) => {
  const isMultiScreenSupported = ref(false);
  const isThereASecondScreen = ref(false);
  const isSingleScreenPreference = ref(false);
  const windowManagementPermission = ref("prompt");
  const screenDetails = ref();
  const numScreens = ref(1);
  const currentScreen = ref();
  const secondScreen = ref();
  const secondWindow = ref();
  const secondWindowName = "Preview";

  const checkMultiScreenSupport = () => {
    if (process.browser) {
      isMultiScreenSupported.value = "getScreenDetails" in window;
    }
  };

  const checkForSecondScreen = () => {
    if (process.browser) {
      isThereASecondScreen.value = window.screen.isExtended;
    }
  };

  const setScreenDetails = async () => {
    if (isMultiScreenSupported.value) {
      screenDetails.value = await window.getScreenDetails();
      numScreens.value = screenDetails.value.screens.length;
      currentScreen.value = screenDetails.value.currentScreen;
      secondScreen.value = screenDetails.value.screens.filter((screen) => {
        return screen !== screenDetails.value.currentScreen;
      })[0];
    }
  };

  const init = async () => {
    checkMultiScreenSupport();
    checkForSecondScreen();
    if (windowManagementPermission.value === "granted") {
      await setScreenDetails();
    }
  };

  const openLink = (path: string) => {
    if (numScreens.value === 1) {
      navigateTo(path);
    } else {
      let screen = secondScreen.value;
      const options = {
        x: screen.availLeft,
        y: screen.availTop,
        width: screen.availWidth,
        height: screen.availHeight,
      };
      if (secondWindow.value && !secondWindow.value.closed) {
        if (
          currentScreen.value.availTop ===
            secondWindow.value?.screen?.availTop &&
          currentScreen.value.availLeft ===
            secondWindow.value?.screen?.availLeft
        ) {
          secondWindow.value.close();
          secondWindow.value = window.open(
            path,
            secondWindowName,
            getFeaturesFromOptions(options)
          );
        } else {
          secondWindow.value.location.replace(path);
        }
      } else {
        secondWindow.value = window.open(
          path,
          secondWindowName,
          getFeaturesFromOptions(options)
        );
      }
    }
  };

  nuxtApp.hook("app:created", async () => {
    if (process.browser) {
      navigator.permissions
        .query({ name: "window-management" })
        .then(async (permissionStatus) => {
          windowManagementPermission.value = permissionStatus.state;
          permissionStatus.onchange = () => {
            windowManagementPermission.value = permissionStatus.state;
          };
          await init();
        })
        .catch((e) => {
          windowManagementPermission.value = "denied";
        });
      window.screen.addEventListener("change", async (e: any) => {
        await init();
      });
    }
  });

  return {
    provide: {
      isMultiScreenSupported: isMultiScreenSupported,
      isThereASecondScreen: isThereASecondScreen,
      isSingleScreenPreference,
      windowManagementPermission,
      secondWindowName,
      setScreenDetails,
      openLink,
    },
  };
});

function getFeaturesFromOptions(options: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return (
    "left=" +
    options.x +
    ",top=" +
    options.y +
    ",width=" +
    options.width +
    ",height=" +
    options.height
  );
}
