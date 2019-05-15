QUnit.test("Screen: basic lifecycle", function(assert) {
    function test(screen) {
        assert.ok(screen.isUIcreated() === false, screen.constructor.name + ": isUIcreated() should be false.");
        assert.ok(screen.node === null, screen.constructor.name + ": before createUI(), 'node' should be 'null'.");

        screen.createUI();
        assert.ok(screen.isUIcreated() === true, screen.constructor.name + ": after createUI(), isUIcreated() should be true.");
        assert.ok(screen.node instanceof HTMLElement, screen.constructor.name + ": after createUI(), 'node' should be not 'null'.");

        //Skip start() as this would trigger the screen's actions.

        screen.releaseUI();
        assert.ok(screen.isUIcreated() === false, screen.constructor.name + ": after releaseUI(), isUICreated() should be false.");
        assert.ok(screen.node === null, screen.constructor.name + ": after releaseUI(), 'node' is null after releaseUI().");
    }

    const screens = [
        new ScreenIFrame(),
        new ScreenWaitDataDownload(),
        new ScreenUIElements(),
        new ScreenUIElementsAuto(),
        new ScreenUIElementsSequential(),
    ];

    screens.map((screen) => test(screen));
});

QUnit.test("ScreenUIElements: isReady", function(assert) {
    function test(screen, isReadyByDefault) {
        screen.createUI();
        assert.ok(screen.isReady() === isReadyByDefault, screen.constructor.name + ": isReady() should be " + isReadyByDefault + ".");

        screen.releaseUI();
    }

    {
        const screen = new ScreenUIElements(new UIElementHTML(undefined, "Text"));
        test(screen, true, "empty");
    }

    {
        const screen = new ScreenUIElements(new QuestionnaireItemDefinedOne(null, "Question", false, ["op1"]));
        test(screen, true, "one question (not required)");
    }

    {
        const question = new QuestionnaireItemDefinedOne(null, "Question", true, ["op1"]);
        const screen = new ScreenUIElements(question);
        test(screen, false, "one question (required)");
        question.setAnswer("op1");
        assert.ok(screen.isReady() === true, ScreenUIElements.prototype.constructor.name + ": after setAnswer(), isReady() should be true ");
    }

});
QUnit.test("ScreenUIElementsSequential: isReady", function(assert) {
    const question1 = new QuestionnaireItemDefinedOne(null, "Question", true, ["op1"]);
    const question2 = new QuestionnaireItemDefinedOne(null, "Question", true, ["op2"]);
    const question3 = new QuestionnaireItemSystemURL();

    const screen = new ScreenUIElementsSequential(question1, question2, question3);

    screen.createUI();
    screen.start();

    assert.ok(question1.isEnabled() === true, screen.constructor.name + ": question1.isEnable() should be true.");
    assert.ok(question2.isEnabled() === false, screen.constructor.name + ": question2.sEnable() should be false.");
    assert.ok(question3.isEnabled() === false, screen.constructor.name + ": question3.isEnable() should be false.");
    assert.ok(screen.isReady() === false, screen.constructor.name + ": screen.isReady() should be false.");

    question1.setAnswer("op1");
    assert.ok(question1.isEnabled() === false, screen.constructor.name + ": after question1.setAnswer(), question1.isEnable() should be false.");
    assert.ok(question2.isEnabled() === true, screen.constructor.name + ": after question1.setAnswer(), question2.isEnable() should be true.");
    assert.ok(question3.isEnabled() === false, screen.constructor.name + ": after question1.setAnswer(), question3.isEnable() should be false.");
    assert.ok(screen.isReady() === false, screen.constructor.name + ": after question1.setAnswer(), screen.isReady() should remain false.");

    question2.setAnswer("op2");
    assert.ok(question1.isEnabled() === false, screen.constructor.name + ": after question2.setAnswer(), question1.isEnable() should be false.");
    assert.ok(question2.isEnabled() === false, screen.constructor.name + ": after question2.setAnswer(), question2.isEnable() should be false.");
    assert.ok(question3.isEnabled() === true, screen.constructor.name + ": after question2.setAnswer(), question3.isEnable() should be true.");
    assert.ok(screen.isReady() === true, screen.constructor.name + ": after question2.setAnswer(), screen.isReady() should be true.");

    screen.releaseUI();
});

QUnit.test("ScreenUIElementsAuto: isReady", function(assert) {
    const question1 = new QuestionnaireItemDefinedOne(null, "Question", true, ["op1"]);

    const screen = new ScreenUIElementsAuto(question1);
    screen.setPaginateCallback(function() {
        screen.gotPaginateCallback = true;
    });

    screen.createUI();
    screen.start();

    assert.ok(screen.isReady() === false, screen.constructor.name + ": isReady() should be false.");

    question1.setAnswer("op1");
    assert.ok(screen.isReady() === true, screen.constructor.name + ": after setAnswer(), isReady() should be true.");
    assert.ok(screen.gotPaginateCallback === true, screen.constructor.name + ": after setAnswer(), a paginateCallback should be received.");

    screen.releaseUI();
});
