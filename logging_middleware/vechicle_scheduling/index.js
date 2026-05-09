const { getDepots, getVehicles } = require("./api");
const maximizeImpact = require("./schedular");
const Log = require("../logger");

async function main() {
  try {
    // Test with simple valid values
    await Log("backend", "info", "service", "Service started");
    
    const depots = await getDepots();
    const vehicles = await getVehicles();

    for (const depot of depots) {
      const result = maximizeImpact(vehicles, depot.MechanicHours);
      console.log(`Depot ${depot.ID}: Max impact ${result.maxImpact}`);
    }
    
  } catch (error) {
    console.log("Error:", error.message);
  }
}

main();