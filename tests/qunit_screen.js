/**
 Tests ScreenUIElements and ScreenUIElementsSequential lifecycle:
 Tests: createUI(), isReady(), and releaseUI().
 */
QUnit.test("ScreenUIElements & ScreenUIElementsSequential: lifecycle and methods", function(assert) {
    function testScreen(screen, isScreenReadyByDefault, description) {
        var descriptionFormatted = (description !== undefined ? ("(" + description + " )") : ("")); //Verifies if there is something in "description", and formats the text.
        assert.ok(screen.node === null, screen.constructor.name + ": 'node' is 'null' before createUI().");

        screen.createUI();
        assert.ok(screen.node, screen.constructor.name + ": 'node' is not 'null' after createUI().");
        assert.ok(screen.isReady() === isScreenReadyByDefault, screen.constructor.name + ": isReady() returns '" + isScreenReadyByDefault + "'.");

        screen.releaseUI();
        assert.ok(screen.node === null, screen.constructor.name + ": 'node' is null after releaseUI().");
    };

    //Prepare ScreenUIElements with QuestionnaireItems.
    testScreen(new ScreenUIElements(new QuestionnaireItemDefinedOne(null, "Question", false, ["op1"])), true, "one question, not required");

    {
        var screenQuestion = new QuestionnaireItemDefinedOne(null, "Question", true, ["op1"]);
        var screen = new ScreenUIElements(screenQuestion);
        testScreen(screen, false, "one question, required");

        screenQuestion.setAnswer("op1");
        assert.ok(screen.isReady() === true, ScreenUIElements.prototype.constructor.name + ": isReady() must return 'true' after answering the required question.");
    }

    //Tests with ScreenUIElementsSequential.
    {
        var screenQuestion = new QuestionnaireItemDefinedOne(null, "Question", true, ["op1"]);
        var screenQuestion2 = new QuestionnaireItemDefinedOne(null, "Question", true, ["op2"]);
        screen = new ScreenUIElementsSequential(screenQuestion, screenQuestion2);

        screen.createUI();
        screen.start();

        assert.ok(screenQuestion2.isEnabled() === false, screen.constructor.name + ": isEnable() of the 2nd question must be 'false' as long as the 1st is not answered.");

        screenQuestion.setAnswer("op1");
        assert.ok(screenQuestion2.isEnabled() === true, screen.constructor.name + ": isEnable() of the 2nd question must be 'true' if the 1st got answered.");

        screen.releaseUI();
    }
});
