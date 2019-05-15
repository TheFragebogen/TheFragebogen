QUnit.test("ScreenController:", function(assert) {
    //Prepare tests
    const q1 = new QuestionnaireItemDefinedMulti(undefined, "Message", true, ["Option 1", "Option 2", "Option 3"]);
    const screen1 = new ScreenUIElements(
        new UIElementHTML(undefined, "Message"),
        q1
    );

    const q2 = new QuestionnaireItemDefinedOne(undefined, "Message", true, ["Yes"]);
    const screen2 = new ScreenUIElementsAuto(
        q2,
        new QuestionnaireItemSystemConst("Value")
    );

    const q3 = new QuestionnaireItemSVGQuality7pt(undefined, "Message");
    const q4 = new QuestionnaireItemText(undefined, "Message");
    const screen3 = new ScreenUIElementsSequential(
        q3,
        q4,
        new QuestionnaireItemSystemConst("Value")
    );

    const screen4 = new ScreenIFrame(undefined, "http://www.TheFragebogen.de", 1);
    const screen5 = new ScreenWaitDataDownload(undefined, "Message");

    //Prepare screenController
    const htmlElement = document.createElement("div");
    const screenController = new ScreenController([screen1, screen2, screen3, screen4, screen5]);

    assert.ok(screenController.getCurrentScreenIndex() === null, screenController.constructor.name + ": getCurrentScreenIndex() should return null.");
    screenController.init(htmlElement);
    assert.ok(screenController.getCurrentScreenIndex() === 0, screenController.constructor.name + ": after init(), getCurrentScreenIndex() should return 0.");

    //Execute questionnaire
    screenController.start();
    assert.ok(htmlElement.children.length === 1, screenController.constructor.name + ": after start(), parentElement should contain children.");

    assert.ok(screenController.getCurrentScreen() === screen1, screenController.constructor.name + ": after start(), getCurrentScreen() should return screen1.");

    //Screen1
    screen1._sendPaginateCallback(1, true);
    assert.ok(screenController.getCurrentScreen() === screen1, screenController.constructor.name + ": after start(), getCurrentScreen() should _still_ return screen1.");

    q1.setAnswer(q1.getAnswerOptions()[2]);
    q1.setAnswer(q1.getAnswerOptions()[1]);
    screen1._sendPaginateCallback(1, true);

    //Screen2
    assert.ok(screenController.getCurrentScreen() === screen2, screenController.constructor.name + ": getCurrentScreen() should return screen2.");
    q2.setAnswer(q2.getAnswerOptions()[0]);

    //Screen3
    assert.ok(screenController.getCurrentScreen() === screen3, screenController.constructor.name + ": getCurrentScreen() should return screen3.");
    q3.setAnswer("70");
    q4.setAnswer("Text");
    screen3._sendPaginateCallback(1, true);

    //Screen4
    assert.ok(screenController.getCurrentScreen() === screen4, screenController.constructor.name + ": getCurrentScreen() should return screen4.");
    screen4._onFrameLoad(); //Simulate a user navigating.
    screen4._onFrameLoad(); //Simulate a user navigating.

    //Screen5
    assert.ok(screenController.getCurrentScreen() === screen5, screenController.constructor.name + ": getCurrentScreen() should return screen5.");

    //Check exported data is as expected.

    const dataExpected =
        '"Screen index","Type of item","Question","Answer options","Answer"\n' +
        '"0","QuestionnaireItemDefinedMulti","Message","Option 1,Option 2,Option 3","Option 2"\n' +
        '"1","QuestionnaireItemDefinedOne","Message","Yes","Yes"\n' +
        '"1","QuestionnaireItemSystemConst","Value","undefined",undefined\n' +
        '"2","QuestionnaireItemSVGQuality7pt","Message","10-70","70"\n' +
        '"2","QuestionnaireItemText","Message","undefined","Text"\n' +
        '"2","QuestionnaireItemSystemConst","Value","undefined",undefined\n' +
        '"3","url","url","","http://www.TheFragebogen.de"\n' +
        '"3","finalURL","finalURL","","TheFragebogen-Error: Could not get urlFinal of the iframe. Security limitation?"\n' +
        '"3","duration","duration","",2\n';

    const dataExported = screenController.requestDataCSV();
    assert.ok(dataExported.slice(0, -2) === dataExpected.slice(0, -2), screenController.constructor.name + ": requestDataCSV() returned expected data.");
});
