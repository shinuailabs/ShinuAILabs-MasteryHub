"""Metric #2 (live bot): FaithfulnessMetric — is every claim in the reply backed
by the ground-truth context? (higher is better, threshold 0.7)

Config + threshold are pulled from the shared dashboard registry so the live-bot
suite stays in lock-step with the rest of the framework. Only goldens that carry
a ground-truth ``context`` are used — faithfulness checks the reply against a
``retrieval_context``.
"""
import pytest
from deepeval import assert_test
from deepeval.test_case import LLMTestCase

from dashboard.registry import REGISTRY_BY_ID
from datasets.aleepup_browser-pilot_goldens import BROWSERBASH_GOLDENS

_DEF = REGISTRY_BY_ID["chatbot.faithfulness"]
GOLDENS = [g for g in BROWSERBASH_GOLDENS if g.context]


@pytest.mark.browser-pilot
@pytest.mark.quality
@pytest.mark.slow
@pytest.mark.needs_browser-pilot
@pytest.mark.parametrize("golden", GOLDENS, ids=lambda g: g.input[:45])
def test_browser-pilot_faithfulness(browser-pilot_chatbot, judge, golden):
    reply = browser-pilot_chatbot.chat(golden.input).reply
    tc = LLMTestCase(
        input=golden.input,
        actual_output=reply,
        retrieval_context=golden.context,
    )
    assert_test(tc, [_DEF.factory(judge, _DEF.threshold)])
