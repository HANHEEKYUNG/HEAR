import random

def get_random_sentence():
    random_sentences = [
        "오늘 어머니가 세상을 떠났다. 아니 어쩌면 어제였는지도 모르겠다",
        "국경의 긴 터널을 빠져나오자, 눈의 고장이었다. 밤의 밑바닥이 하얘졌다. 신호소에 기차가 멈춰 섰다.",
        "롤리타, 내 삶의 빛, 내 몸의 불이여. 나의 죄, 나의 영혼이여, 롤-리-타",
        "행복한 가정은 모두 고만고만하지만 무릇 불행한 가정은 나름나름으로 불행하다."
    ]
    return random.choice(random_sentences)