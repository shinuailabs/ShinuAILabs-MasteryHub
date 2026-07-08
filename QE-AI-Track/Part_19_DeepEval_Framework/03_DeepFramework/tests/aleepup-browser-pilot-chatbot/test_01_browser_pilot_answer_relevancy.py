"""Metric #1 (live bot): AnswerRelevancyMetric — does the reply stay on-topic
for the question? (higher is better, threshold 0.7)

Referenceless: reads only input + actual_output. Each golden becomes its own
parametrized case. Target = the live BrowserPilot bot; judge = OpenAI gpt-5-mini.
"""
import pytest
from deepeval import assert_test
from deepeval.metrics import AnswerRelevancyMetric
from deepeval.test_case import LLMTestCase

from datasets.aleepup_browser-pilot_goldens import BROWSERBASH_GOLDENS


@pytest.mark.browser-pilot
@pytest.mark.quality
@pytest.mark.slow
@pytest.mark.needs_browser-pilot
@pytest.mark.parametrize("golden", BROWSERBASH_GOLDENS, ids=lambda g: g.input[:45])
def test_browser-pilot_answer_relevancy(browser-pilot_chatbot, judge, golden):
    reply = browser-pilot_chatbot.chat(golden.input).reply
    tc = LLMTestCase(input=golden.input, actual_output=reply)
    metric = AnswerRelevancyMetric(threshold=0.7, model=judge, include_reason=True)
    assert_test(tc, [metric])
