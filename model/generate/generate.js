const fs = require('fs');

const args = process.argv.slice(2);
const dir = args[0];

const C = makeConstants();
const config = makeConfig();

const stream = fs.createWriteStream(dir + "/generated.css");

stream.write("/* DO NOT EDIT THIS FILE*/\n");

stream.write("#slow-speed{background-color: " + config.stepsPerFrame.slow.colour + ";}\n");
stream.write("#medium-speed{background-color: " + config.stepsPerFrame.medium.colour + ";}\n");
stream.write("#fast-speed{background-color: " + config.stepsPerFrame.fast.colour + ";}\n");

stream.write("#start-not-infected{background-color: " + config.startState.notInfected.colour + ";}\n");
stream.write("#start-infected{background-color: " + config.startState.infected.colour + ";}\n");

stream.write("#capital-high{background-color: " + config.capital.high.colour + ";}\n");
stream.write("#capital-low{background-color: " + config.capital.low.colour + ";}\n");

stream.write("#display-sick-early{background-color: " + config.displaySick.early.colour + ";}\n");
stream.write("#display-sick-late{background-color: " + config.displaySick.late.colour + ";}\n");

stream.write("#no-masks{background-color: " + config.masks.specs.none.colour + ";}\n");
stream.write("#encourage-masks{background-color: " + config.masks.specs.encourage.colour + ";}\n");
stream.write("#require-masks{background-color: " + config.masks.specs.require.colour + ";}\n");
stream.write("#enforce-masks{background-color: " + config.masks.specs.enforce.colour + ";}\n");

stream.write("#no-tests{background-color: " + config.tests.none.colour + ";}\n");
stream.write("#light-tests{background-color: " + config.tests.light.colour + ";}\n");
stream.write("#heavy-tests{background-color: " + config.tests.heavy.colour + ";}\n");

stream.write("#no-trace{background-color: " + config.trace.specs.none.colour + ";}\n");
stream.write("#forward-trace{background-color: " + config.trace.specs.forward.colour + ";}\n");
stream.write("#backward-trace{background-color: " + config.trace.specs.backward.colour + ";}\n");
stream.write("#both-trace{background-color: " + config.trace.specs.both.colour + ";}\n");

stream.write("#no-isolate{background-color: " + config.isolate.none.colour + ";}\n");
stream.write("#encourage-isolate{background-color: " + config.isolate.encourage.colour + ";}\n");
stream.write("#require-isolate{background-color: " + config.isolate.require.colour + ";}\n");
stream.write("#enforce-isolate{background-color: " + config.isolate.enforce.colour + ";}\n");

stream.write(".road-colour{background-color: " + config.road.style + ";}\n");

stream.write(".school-colour{background-color: " + config.workStyle[C.WORKTYPE.SCHOOLS] + ";}\n");
stream.write(".offices-colour{background-color: " + config.workStyle[C.WORKTYPE.OFFICES] + ";}\n");
stream.write(".meat-colour{background-color: " + config.workStyle[C.WORKTYPE.MEAT] + ";}\n");

stream.write(".bunkhouse-colour{background-color: " + config.bunkHouse.style + ";}\n");
stream.write(".house-colour{background-color: " + config.house.style + ";}\n");
stream.write(".isolation-colour{background-color: " + config.isolation.style + ";}\n");

stream.write(".worship-colour{background-color: " + config.church.style + ";}\n");
stream.write(".bars-colour{background-color: " + config.pub.style + ";}\n");
stream.write(".restaurants-colour{background-color: " + config.restaurant.style + ";}\n");
stream.write(".clubs-colour{background-color: " + config.club.style + ";}\n");

stream.write(".outside-colour{background-color: " + config.outside.style + ";}\n");
stream.write(".cemetary-colour{background-color: " + config.cemetary.style + ";}\n");

stream.write(".icu-colour{background-color: " + config.hospital.style.icu + ";}\n");
stream.write(".ward-colour{background-color: " + config.hospital.style.ward + ";}\n");
stream.write(".waiting-colour{background-color: " + config.hospital.style.hallway + ";}\n");

