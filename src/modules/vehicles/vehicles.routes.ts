import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post('/',auth('admin'),vehiclesController.createVehicle)
router.get('/', vehiclesController.getAllVehicles)
router.get('/:vehicleId',vehiclesController.getSingleVehicle);
router.put('/:vehicleId', auth('admin'), vehiclesController.updateVehicle);
router.delete('/:vehicleId', auth('admin'), vehiclesController.deleteVehicle)

export const vehiclesRouter = router;