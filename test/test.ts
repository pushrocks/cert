import "typings-test";
import "should";
import * as cert from "../dist/index";
import {Qenv} from "qenv";

let testQenv = new Qenv(process.cwd(), process.cwd() + "/.nogit");

