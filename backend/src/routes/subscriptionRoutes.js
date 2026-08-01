const express=require("express");

const router=express.Router();


const {
    getSubscriptions,
    changeStatus,
    createSubscription,
    mySubscriptions,
    pause,
    resume,
    cancel,
    calendar,
    updateSubscription
} = require("../controllers/subscriptionController");

const authMiddleware =
require("../middleware/authMiddleware");



router.post(
"/create",
authMiddleware,
createSubscription
);


router.get(
"/",
getSubscriptions
);


router.put(
"/:id/status",
changeStatus
);

router.get(
  "/my",
  authMiddleware,
  mySubscriptions
);

router.put(
  "/:id/pause",
  pause
);

router.put(
  "/:id/resume",
  resume
);

router.put(
  "/:id/cancel",
  cancel
);
router.get(
  "/:id/calendar",
  authMiddleware,
  calendar
);
router.put(
  "/:id",
  authMiddleware,
  updateSubscription
);


module.exports=router;