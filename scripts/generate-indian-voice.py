"""Generate the bundled Indian English female Tambola voice pack.

Requires the build-only edge-tts package in scripts/.voice-tools. The resulting
MP3 assets are committed with the application and are played offline at runtime.
"""

from __future__ import annotations

import asyncio
import argparse
import sys
from pathlib import Path

TOOLS_DIRECTORY = Path(__file__).parent / '.voice-tools'
sys.path.insert(0, str(TOOLS_DIRECTORY))

try:
    import edge_tts
except ImportError as error:
    raise SystemExit(
        'Install the build-only generator first:\n'
        'python -m pip install --target scripts/.voice-tools edge-tts'
    ) from error

VOICE = 'en-IN-NeerjaNeural'
OUTPUT_DIRECTORY = Path(__file__).parent.parent / 'public' / 'audio' / 'voice' / 'indian-female'
ONES = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
]
TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
DIGITS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']


def number_words(number: int) -> str:
    if number < 20:
        return ONES[number]
    tens_word, ones_digit = TENS[number // 10], number % 10
    return tens_word if ones_digit == 0 else f'{tens_word} {ONES[ones_digit]}'


def announcement(number: int) -> str:
    if number < 10:
        return f'Single Number {number_words(number)}.'
    digit_call = ' '.join(DIGITS[int(digit)] for digit in str(number))
    return f'Number {digit_call}, {number_words(number)}.'


async def generate_clip(number: int) -> None:
    output_path = OUTPUT_DIRECTORY / f'{number}.mp3'
    communicator = edge_tts.Communicate(
        announcement(number),
        VOICE,
        rate='+4%',
        pitch='+3Hz',
        volume='+10%'
    )
    await communicator.save(str(output_path))


async def main(numbers: list[int]) -> None:
    OUTPUT_DIRECTORY.mkdir(parents=True, exist_ok=True)
    for number in numbers:
        await generate_clip(number)
        print(f'Generated {number}', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--numbers', nargs='+', type=int, default=list(range(1, 91)))
    arguments = parser.parse_args()
    if any(number < 1 or number > 90 for number in arguments.numbers):
        raise SystemExit('Voice numbers must be between 1 and 90.')
    asyncio.run(main(arguments.numbers))
